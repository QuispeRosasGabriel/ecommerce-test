const useLocalStorage = () => {
    const getItem = (key: string) => localStorage.getItem(key);
    const setItem = (key: string, value: string) => localStorage.setItem(key, value);
    const removeItem = (key: string) => localStorage.removeItem(key);
    const clearStorage = () => localStorage.clear();
  
    return {
      clearStorage,
      getItem,
      removeItem,
      setItem
    };
  };
  
  export default useLocalStorage;