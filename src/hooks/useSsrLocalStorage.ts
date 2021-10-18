export default function useSsrLocalStorage<T>(
  key: string,
  initial: T,
): [string | T, (value: string) => void] {

  if (typeof window === 'undefined') {
    return [initial, () => {}];
  }

  const useLocalStorage = require('react-use-localstorage').default;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useLocalStorage(key, initial);
}
