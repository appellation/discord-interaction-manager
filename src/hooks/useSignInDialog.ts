import useGlobalState from '../state';

export default function useSignInDialog() {
	return useGlobalState('state');
}
