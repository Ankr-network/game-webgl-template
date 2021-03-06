import {Status} from "./Statuses";

export function ExternalMethod() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value!;

    descriptor.value = function(id: string, payload: string) {
      let prop = null;
      if(payload) {
        prop = tryToParseOrReturnString(payload);
      }

      try {
        const returnValue = originalMethod.apply(this, [prop]);
        if(returnValue instanceof Promise) {
          returnValue
            .then((value: any) => window.MQ.addMessage(id, Status.Success, value))
            .catch((e: Error) => window.MQ.addMessage(id, Status.Error, e.message));
        } else {
          window.MQ.addMessage(id, Status.Success, returnValue);
        }
      } catch (e) {
        window.MQ.addMessage(id, Status.Error, e.message);
      }
    };

    return descriptor as typeof target;
  };
}

const tryToParseOrReturnString = (payload: string): any => {
  try {
    return JSON.parse(payload);
  } catch (e) {
    return payload;
  }
};
