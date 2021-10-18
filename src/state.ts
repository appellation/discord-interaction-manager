import { createGlobalState } from 'react-hooks-global-state';

const { useGlobalState } = createGlobalState({ state: false });
export default useGlobalState;
