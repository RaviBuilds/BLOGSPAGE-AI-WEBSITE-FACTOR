import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { logger } from '../logging/Logger';

/**
 * Durably commit a file, atomically, from the caller's perspective.
 *
 * This is the M2.3-A BLOCKER-3 fix: the previous write path
 * (writeFile(temp) → rename) was atomic against a PROCESS crash but not
 * DURABLE against a power loss or OS crash, because neither the file bytes
 * nor the rename were flushed from the page cache. A commit that "succeeded"
 * could vanish, or — worse — the manifest rename could survive while the
 * artifact bytes it references were lost, producing a manifest CURRENT entry
 * whose version file is missing or zero-length.
 *
 * Required ordering:
 *
 *   1. open temp file ('w')
 *   2. write bytes
 *   3. fsync the FILE (fd.sync) — pushes the bytes past the page cache
 *   4. close the file
 *   5. rename temp → target (atomic visibility: readers never see a
 *      partial file)
 *   6. attempt directory metadata sync (best-effort; see below)
 *   7. close the directory handle
 *
 * On failure of steps 1-5 the temp file is removed and the error rethrown;
 * the target is untouched.
 *
 * PLATFORM NOTE (Windows vs POSIX directory fsync)
 * ------------------------------------------------
 * There is no portable way to fsync a directory. On POSIX, fsync() on a
 * directory fd flushes the directory entry that makes the rename durable.
 * On Windows, opening a directory as a file fails (EPERM/EISDIR), so step 6
 * degrades to a logged debug entry. This is the documented platform
 * limitation: after a successful file fsync, Windows makes the renamed
 * file's data durable; only the durability of the directory-entry metadata
 * itself is platform-dependent. A directory-sync failure is therefore NEVER
 * turned into a write failure — the artifact bytes are already fsync-durable
 * at that point, and failing the write would turn a successful commit into
 * an unexplained crash. File fsync (step 3) is never weakened or skipped.
 *
 * Write ordering across the persistence layer remains:
 *   artifact durable commit → manifest durable commit
 * (see ArtifactRepository.saveArtifact). There is deliberately NO
 * cross-module transaction — that is M2.4 territory.
 *
 * The caller is responsible for holding the appropriate per-project write
 * lock (ProcessWriteLock) around read-modify-write sequences.
 */
export async function durableWrite(
  targetPath: string,
  content: string,
  encoding: BufferEncoding = 'utf-8'
): Promise<{ sha256: string }> {
  const dir = path.dirname(targetPath);
  const tempPath = `${targetPath}.tmp-${process.pid}-${Date.now()}`;

  // Digest of the exact bytes being committed. Returned so the caller can
  // record it (the manifest's contentSha256) and the read path can verify
  // that a version file was not modified after its commit.
  const sha256 = crypto.createHash('sha256').update(content, encoding).digest('hex');

  let fd: fs.promises.FileHandle | undefined;

  try {
    fd = await fs.promises.open(tempPath, 'w');
    await fd.writeFile(content, encoding);
    // fsync the FILE: the commit point for the bytes themselves.
    await fd.sync();
    await fd.close();
    fd = undefined;
    // Atomic visibility: a reader either sees the complete old file or the
    // complete new file, never a partial write.
    await fs.promises.rename(tempPath, targetPath);
  } catch (error) {
    if (fd) {
      try {
        await fd.close();
      } catch {
        // fd already closed or the handle is invalid; nothing more to do.
      }
    }
    try {
      await fs.promises.unlink(tempPath);
    } catch {
      // temp may never have been created; nothing more to do.
    }
    throw error;
  }

  // Best-effort directory metadata sync. See the platform note above: this
  // is expected to fail on Windows (EPERM/EISDIR opening a directory) and
  // is logged, not thrown. The file's bytes are fsync-durable already.
  try {
    const dirHandle = await fs.promises.open(dir, 'r');
    try {
      await dirHandle.sync();
    } finally {
      await dirHandle.close();
    }
  } catch (dirError) {
    logger.debug(
      'Directory metadata sync unavailable (expected on Windows); file data is fsync-durable',
      {
        component: 'durableWrite',
        dir,
        reason: (dirError as NodeJS.ErrnoException).code ?? String(dirError)
      }
    );
  }

  return { sha256 };
}