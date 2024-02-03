import { ReactNode, createContext, useState } from "react";

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
export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
    children: ReactNode
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
    
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPast, setAmountSecondsPast] = useState(0)

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    function markCurrentCycleAsFinished() {
        setCycles(state => 
            state.map((cycle) => {
                if(cycle.id === activeCycleId) {
                    return { ...cycle, finishedDate: new Date() }
                } else {
                    return cycle
                }
        }))
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
        
        setCycles((state) => [ ...state, newCycle])
        setActiveCycleId(newCycle.id)
        
        setAmountSecondsPast(0)
        
        // reset()
    }
    
    function interruptCurrentCycle() {
        setCycles(state => state.map((cycle) => {
            if(cycle.id === activeCycleId) {
                return { ...cycle, interruptedDate: new Date() }
            } else {
                return cycle
            }
        })
        )
        setActiveCycleId(null)
        document.title = 'Timer Typescript'
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