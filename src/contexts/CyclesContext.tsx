import { ReactNode, createContext, useReducer, useState } from "react";

interface CreateCycleData {
    task: string
    minutesAmount: number
}

interface Cycle {
    id: string,
    task: string,
    minutesAmount: number,
    startDate: Date,
    interruptedDate?: Date,
    finishedDate?: Date

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

interface CyclesState {
    cycles: Cycle[]
    activeCycleId: string | null
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
    children: ReactNode
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
    
    const [cyclesState, dispatch] = useReducer((state: CyclesState, action: any) => {
        switch(action.type) {
            case 'ADD_NEW_CYCLE':
                return {
                    ...state,
                    cycles: [...state.cycles, action.payload.newCycle],
                    activeCycleId: action.payload.newCycle.id,
                }
            case 'INTERRUPT_CURRENT_CYCLE':
                return {
                    ...state,
                    cycles: state.cycles.map((cycle) => {
                        if(cycle.id === state.activeCycleId) {
                            return { ...cycle, interruptedDate: new Date() }
                        } else {
                            return cycle
                        }
                    }),
                    activeCycleId: null
                }
            case 'MARK_CURRENT_CYCLE_AS_FINISHED':
                return {
                    ...state,
                    cycles: state.cycles.map((cycle) => {
                        if(cycle.id === state.activeCycleId) {
                            return { ...cycle, finishedDateDate: new Date() }
                        } else {
                            return cycle
                        }
                    }),
                    activeCycleId: null
                }
            default: 
                return state
        }

    }, 
    {
        cycles: [],
        activeCycleId: null
    })

    const [amountSecondsPast, setAmountSecondsPast] = useState(0)


    const { cycles, activeCycleId} = cyclesState


    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    function markCurrentCycleAsFinished() {

        dispatch({
            type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
            payload: {
                activeCycleId
            },
        })
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
        
        dispatch({
            type: 'ADD_NEW_CYCLE',
            payload: {
                newCycle,
            },
        })
        
        setAmountSecondsPast(0)
        
    }
    
    function interruptCurrentCycle() {
        
        dispatch({
            type: 'INTERRUPT_CURRENT_CYCLE',
            payload: {
                activeCycleId
            },
        })
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