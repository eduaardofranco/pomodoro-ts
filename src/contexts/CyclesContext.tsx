import { ReactNode, createContext, useEffect, useReducer, useState } from "react";
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
        activeCycleId: null,
    }, (initialState) => {
        const storedStateJSON = localStorage.getItem('@pomodoro-timer:cycles-state-1.0.0')

        if(storedStateJSON) {
            return JSON.parse(storedStateJSON)
        }

        return initialState
    })

    const [amountSecondsPast, setAmountSecondsPast] = useState(0)

    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState)

        localStorage.setItem('@pomodoro-timer:cycles-state-1.0.0', stateJSON)

    }, [cyclesState])


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