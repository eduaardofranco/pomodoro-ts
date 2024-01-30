import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import { createContext, useState } from "react";
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { NewCycleForm } from "../Home/Components/NewCycleForm";
import { Countdown } from "./Components/CountDown";
import * as zod from 'zod'

interface Cycle {
    id: string,
    task: string,
    minutesAmount: number,
    startDate: Date,
    interruptedDate?: Date,
    finishedDate?: Date

}
interface CyclesContextType {
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    amountSecondsPast: number
    markCurrentCycleAsFinished: () => void
    setSecondsPassed: (seconds: number) => void
}
//validation schema
const newCycleFormValidationSchema = zod.object({
    //task will be string, min 1 character, if ommited show message given
    task: zod.string().min(1, 'Inform a task'),
    //minutesamout will be number min 5 max 60
    minutesAmount: zod.number().min(1).max(60)
})

export const CyclesContext = createContext({} as CyclesContextType)
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {


    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPast, setAmountSecondsPast] = useState(0)


    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,

        }
    })

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

    
    const handleCreateNewCycle = (data: NewCycleFormData) => {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }
        
        setCycles((state) => [ ...state, newCycle])
        setActiveCycleId(newCycle.id)
        
        setAmountSecondsPast(0)
        
        reset()
    }
    
    function handleInterruptCycle() {
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
    
    const { handleSubmit, watch, reset } = newCycleForm

    const task = watch('task')
    const isSubmitDisabled = !task


    return(
        <HomeContainer>
            <form action="" onSubmit={handleSubmit(handleCreateNewCycle)} >
                <CyclesContext.Provider
                    value={{
                        activeCycle,
                        activeCycleId,
                        amountSecondsPast,
                        markCurrentCycleAsFinished,
                        setSecondsPassed
                    }}>
                    
                    <FormProvider {...newCycleForm}>
                        <NewCycleForm />
                    </FormProvider>

                    <Countdown />
                </CyclesContext.Provider>
                {activeCycle ? (
                    <StopCountdownButton type="button" onClick={handleInterruptCycle}>
                        <HandPalm size={24} />
                        Stop
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton type="submit" disabled={isSubmitDisabled} >
                        <Play size={24} />
                        Start
                    </StartCountdownButton>
                    
                )}
            </form>
        </HomeContainer>
    )
}