import { Play } from "phosphor-react";
import { CountdownContainer, FormContainer, HomeContainer, MinutesInput, Separator, StartCountdownButton, TaskInput } from "./styles";

export function Home() {
    return(
        <HomeContainer>

            <form action="">
                <FormContainer>
                    <label htmlFor="task">Will work on</label>
                    <TaskInput
                        type="text"
                        id="task"
                        placeholder="Give a name to your project"
                        list="task-suggestions"
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
                        max={60}
                        min={5}
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

                <StartCountdownButton type="submit">
                    <Play size={24} />
                    Start
                </StartCountdownButton>
            </form>
        </HomeContainer>
    )
}