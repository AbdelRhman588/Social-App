
import { createContext, useState } from "react";

type CounterContextType = {
  counter: number;
  setcounter: React.Dispatch<React.SetStateAction<number>>;
  sayHello: () => void;
};

export const CounterContext = createContext<CounterContextType | null>(null);

export default function CounterContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [counter, setcounter] = useState<number>(0);

  function sayHello() {
    console.log("hello");
  }

  return (
    <CounterContext.Provider value={{ counter, setcounter, sayHello }}>
      {children}
    </CounterContext.Provider>
  );
}
