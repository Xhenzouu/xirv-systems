import { AsyncLocalStorage } from "async_hooks"

export interface RequestContext {
  requestId: string
}

export const requestContext = new AsyncLocalStorage<RequestContext>()

export function getRequestId(): string | undefined {
  const store = requestContext.getStore()
  return store?.requestId
}