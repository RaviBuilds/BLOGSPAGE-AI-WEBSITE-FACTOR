/**
 * Error thrown when a txId is reused with conflicting transaction semantics.
 * 
 * Per M2.1 idempotency contract:
 * - same txId + identical semantics → idempotent success
 * - same txId + conflicting semantics → ConflictingTransactionError
 * 
 * This enforces txId uniqueness within the project lock to prevent
 * duplicate state advances from retry scenarios.
 */
export class ConflictingTransactionError extends Error {
  constructor(
    message: string,
    public readonly txId: string,
    public readonly existingTransaction: {
      from: string;
      to: string;
      triggeredBy: string;
      returnTarget?: string;
    },
    public readonly requestedTransaction: {
      from: string;
      to: string;
      triggeredBy: string;
      returnTarget?: string;
    }
  ) {
    super(message);
    this.name = 'ConflictingTransactionError';
  }
}
