import { Play } from "phosphor-react";
import { CountdownContainer, FormContainer, HomeContainer, MinutesInput, Separator, StartCountdownButton, TaskInput } from "./styles";
import { useForm } from 'react-hook-form'
import { zodResolver} from '@hookform/resolvers/zod'
import * as zod from 'zod'

//validation schema
const newCycleFormValidationSchema = zod.object({
    //task will be string, min 1 character, if ommited show message given
    task: zod.string().min(1, 'Inform a task'),
    //minutesamout will be number min 5 max 60
    minutesAmount: zod.number().min(5).max(60)
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    })

    const handleCreateNewCycle = (data: NewCycleFormData) => {
        console.log(data)
        reset()
    }
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
                        step={5}
                        // max={60}
                        // min={5}
                        {...register('minutesAmount', {valueAsNumber: true})}
                    />

                    <span>minutes.</span>
                </FormContainer>
                <CountdownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountdownContainer>

                <StartCountdownButton type="submit" disabled={isSubmitDisabled} >
                    <Play size={24} />
                    Start
                </StartCountdownButton>
            </form>
        </HomeContainer>
    )
}