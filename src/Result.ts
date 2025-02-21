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
