interface OkResult<OkType> {
	value: OkType;
	error: null;
}

interface ErrorResult<ErrorType> {
	value: null;
	error: ErrorType;
}

export type Result<OkType, ErrorType> = OkResult<OkType> | ErrorResult<ErrorType>;

// Utility functions to simplify creating ok and error results
export const okResult = <OkType>(v: OkType): OkResult<OkType> => {
	return { value: v, error: null };
};

export const errorResult = <ErrorType>(e: ErrorType): ErrorResult<ErrorType> => {
	return { value: null, error: e };
};

// biome-ignore lint/suspicious/noExplicitAny: any required for a generic function
export function resultify<FnType extends (...args: any[]) => any, ErrType extends Error>(fn: FnType): (...args: Parameters<FnType>) => Result<ReturnType<FnType>, ErrType> {
	return (...args: Parameters<FnType>): Result<ReturnType<FnType>, ErrType> => {
		try {
			// throw { message: 'Error here', cause: 'a cause', name: 'Falko', somethingExtra: 'argh'} as unknown as ErrType
			return okResult(fn(...args))
		} catch (e) {
			return errorResult(e as ErrType)
			// const err = e as ErrType
			// return { value: null, error: err}
		}
	}
}

// biome-ignore lint/suspicious/noExplicitAny: any required for a generic function
export function resultifyAsync<FnType extends (...args: any[]) => any, ErrType extends Error>(fn: FnType): (...args: Parameters<FnType>) => Promise<Result<Awaited<ReturnType<FnType>>, ErrType>> {
	return async (...args: Parameters<FnType>): Promise<Result<Awaited<ReturnType<FnType>>, ErrType>> => {
		try {
			// throw { message: 'Error here', cause: 'a cause', name: 'Falko', somethingExtra: 'argh'} as unknown as ErrType
			return okResult(await fn(...args))
		} catch (e) {
			return errorResult(e as ErrType)
		}
	}
}
