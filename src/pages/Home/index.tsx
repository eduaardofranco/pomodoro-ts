import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { NewCycleForm } from "../Home/Components/NewCycleForm";
import { Countdown } from "./Components/CountDown";
import * as zod from 'zod'
import { useContext } from "react";
import { CyclesContext } from "../../contexts/CyclesContext";

//validation schema
const newCycleFormValidationSchema = zod.object({
    //task will be string, min 1 character, if ommited show message given
    task: zod.string().min(1, 'Inform a task'),
    //minutesamout will be number min 5 max 60
    minutesAmount: zod.number().min(1).max(60)
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
    const { activeCycle, createNewCycle, interruptCurrentCycle} = useContext(CyclesContext)


    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,

        }
    })


    
    const { handleSubmit, watch, reset } = newCycleForm

    function handleCreateNewCycle( data: NewCycleFormData) {
        createNewCycle(data)
        reset()
    }

    const task = watch('task')
    const isSubmitDisabled = !task


    return(
        <HomeContainer>
            <form action="" onSubmit={handleSubmit(handleCreateNewCycle)} >
                    
                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>

                <Countdown />
                {activeCycle ? (
                    <StopCountdownButton type="button" onClick={interruptCurrentCycle}>
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