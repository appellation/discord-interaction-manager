import { KEY_AUTH_TOKEN } from '../constants';
import useSsrLocalStorage from './useSsrLocalStorage';

export default function useToken() {
	return useSsrLocalStorage(KEY_AUTH_TOKEN, '');
}
