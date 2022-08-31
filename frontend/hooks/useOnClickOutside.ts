import { useEffect } from 'react';

function useOnClickOutside(refs: any[], handler: any) {
  useEffect(
    () => {
      const listener = (event: any) => {
        const b = refs.every((ref: any) => {
          if (!ref.current || ref.current.contains(event.target)) {
            return false;
          }
          return true;
        });
        if (b) {
          handler(event);
        }
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },

    [refs, handler]
  );
}

export default useOnClickOutside;