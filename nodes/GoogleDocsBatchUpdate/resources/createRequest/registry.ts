import { RequestDefinition } from '../../utils/types';

export const requests: RequestDefinition[] = [];

export const registerRequest = (request: RequestDefinition) => {
    requests.push(request);
};
