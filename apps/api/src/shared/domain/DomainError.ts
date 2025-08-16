import { ErrorCodes } from "#shared/domain/ErrorCodes";

export abstract class DomainError extends Error {
	public abstract readonly code: ErrorCodes;
	public abstract readonly message: string;

	public static isDomainError(error: unknown): error is DomainError {
		return error instanceof DomainError;
	}
}
