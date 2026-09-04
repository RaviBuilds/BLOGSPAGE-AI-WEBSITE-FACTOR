/**
 * Mock ValidationContext for M2.2 tests.
 */

import { ArtifactType } from '../gates/GateTypes';
import { ValidationContext } from '../gates/ValidationContext';

export class MockValidationContext implements ValidationContext {
  private artifacts = new Map<string, Set<ArtifactType>>();
  private conditions = new Map<string, Map<string, boolean>>();

  setArtifact(projectId: string, type: ArtifactType, exists: boolean): void {
    if (!this.artifacts.has(projectId)) {
      this.artifacts.set(projectId, new Set());
    }
    if (exists) {
      this.artifacts.get(projectId)!.add(type);
    } else {
      this.artifacts.get(projectId)!.delete(type);
    }
  }

  setCondition(projectId: string, condition: string, value: boolean): void {
    if (!this.conditions.has(projectId)) {
      this.conditions.set(projectId, new Map());
    }
    this.conditions.get(projectId)!.set(condition, value);
  }

  async hasArtifact(projectId: string, type: ArtifactType): Promise<boolean> {
    return this.artifacts.get(projectId)?.has(type) ?? false;
  }

  async checkCondition(projectId: string, condition: string): Promise<boolean> {
    return this.conditions.get(projectId)?.get(condition) ?? false;
  }
}
