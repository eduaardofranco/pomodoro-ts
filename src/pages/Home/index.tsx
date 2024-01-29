import { HandPalm, Play } from "phosphor-react";
import { CountdownContainer, FormContainer, HomeContainer, MinutesInput, Separator, StartCountdownButton, StopCountdownButton, TaskInput } from "./styles";
import { useForm } from 'react-hook-form'
import { zodResolver} from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useEffect, useState } from "react";
import { differenceInSeconds } from 'date-fns'

//validation schema
const newCycleFormValidationSchema = zod.object({
    //task will be string, min 1 character, if ommited show message given
    task: zod.string().min(1, 'Inform a task'),
    //minutesamout will be number min 5 max 60
    minutesAmount: zod.number().min(1).max(60)
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
    id: string,
    task: string,
    minutesAmount: number,
    startDate: Date,
    interruptedDate?: Date,
    finishedDate?: Date

}

export function Home() {

    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPast, setAmountSecondsPast] = useState(0)

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,

        }
    })

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    
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
    
    
    //if there is an acitve cycle runing, convert minutes to seconds
    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
    
    
    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPast : 0
    
    const minutesAmount = Math.floor(currentSeconds / 60)
    const secondsAmount = currentSeconds % 60
    
    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')
    
    useEffect(() => {
        if(activeCycle) {
            document.title = `${minutes}:${seconds}`
        }
    }, [minutes, seconds])
    
    useEffect(() => {
        let interval: number
        if(activeCycle) {
            interval = setInterval(() => {
                const secondsDifference = differenceInSeconds(
                    new Date(),
                    activeCycle.startDate
                )
                if(secondsDifference >= totalSeconds) {
                    setCycles(state => state.map((cycle) => {
                        if(cycle.id === activeCycleId) {
                            return { ...cycle, finishedDate: new Date() }
                        } else {
                            return cycle
                        }
                    }))
                    setAmountSecondsPast(totalSeconds)
                    clearInterval(interval)
                } else {
                    setAmountSecondsPast(secondsDifference)
                }
            }, 1000)
        }
        return () => {
            clearInterval(interval)
        }
    }, [activeCycle, totalSeconds, activeCycleId, cycles])

    const task = watch('task')
    const isSubmitDisabled = !task

    return(
        <HomeContainer>
            <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
                <FormContainer>
                    <label htmlFor="task">Will work on</label>
                    <TaskInput
                        type="text"
                        id="task"
                        placeholder="Give a name to your project"
                        list="task-suggestions"
                        {...register('task')}
                        disabled={!!activeCycle}
                    />
                    <datalist id="task-suggestions">
                        <option value="Project react"></option>
                        <option value="Project vue"></option>
                        <option value="Project angular"></option>
                    </datalist>

                    <label htmlFor="minutesAmout">During</label>
                    <MinutesInput
                        type="number"
                        id="minutesAmout"
                        placeholder="0:0"
                        step={1}
                        // max={60}
                        // min={5}
                        {...register('minutesAmount', {valueAsNumber: true})}
                        disabled={!!activeCycle}
                    />

                    <span>minutes.</span>
                </FormContainer>
                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>
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