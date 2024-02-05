import { ReactNode, createContext, useReducer, useState } from "react";
import { Cycle, CyclesState, cyclesReducer } from "../reducers/cycles/reducer";
import { ActionTypes, addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";

interface CreateCycleData {
    task: string
    minutesAmount: number
}

interface CyclesContextType {
    cycles: Cycle[]
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    amountSecondsPast: number
    markCurrentCycleAsFinished: () => void
    setSecondsPassed: (seconds: number) => void
    createNewCycle:  (data: CreateCycleData) => void
    interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
    children: ReactNode
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
    
    const [cyclesState, dispatch] = useReducer(cyclesReducer,
    {
        cycles: [],
        activeCycleId: null
    })

    const [amountSecondsPast, setAmountSecondsPast] = useState(0)


    const { cycles, activeCycleId} = cyclesState


    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    function markCurrentCycleAsFinished() {

        dispatch(markCurrentCycleAsFinishedAction())
    }

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPast(seconds)
    }

    const createNewCycle = (data: CreateCycleData) => {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }
        
        dispatch(addNewCycleAction(newCycle))
        
        setAmountSecondsPast(0)
        
    }
    
    function interruptCurrentCycle() {
        
        dispatch(interruptCurrentCycleAction())
    }
    
    return (

        <CyclesContext.Provider
            value={{
                activeCycle,
                activeCycleId,
                amountSecondsPast,
                markCurrentCycleAsFinished,
                setSecondsPassed,
                createNewCycle, 
                interruptCurrentCycle,
                cycles
            }}
        >
            { children }
        </CyclesContext.Provider>

    )
}