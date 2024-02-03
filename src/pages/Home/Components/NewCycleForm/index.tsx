import { FormContainer, MinutesInput, TaskInput } from "./styles";
import { useContext } from "react";
import { CyclesContext } from "../../../../contexts/CyclesContext";
import { useFormContext } from "react-hook-form";


export function NewCycleForm () {
    const { activeCycle } = useContext(CyclesContext)
    const { register } = useFormContext()

    return(
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
                max={60}
                min={1}
                {...register('minutesAmount', {valueAsNumber: true})}
                disabled={!!activeCycle}
            />

            <span>minutes.</span>
        </FormContainer>
    )
}