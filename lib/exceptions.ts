export class ApplicantOnlyError extends Error {
  constructor(message = "This action is for applicants only") {
    super(message)
  }
}

export class RequiresResumeCreatedError extends Error {
  constructor(message = "This action requires a created resume") {
    super(message)
  }
}

export class RequiresCompanyCreatedError extends Error {
  constructor(message = "This action requires a created company") {
    super(message)
  }
}

export class DefaultCompanyError extends Error {
  constructor(message = "This action is not for default company") {
    super(message)
  }
}

export class DefaultResumeError extends Error {
  constructor(message = "This action is not for default resume") {
    super(message)
  }
}
