import { useContext } from "react";
import { HistoryContainer, HistoryList, Status } from "./styles";   
import { CyclesContext } from "../../contexts/CyclesContext";

export function History() {
    const { cycles } = useContext(CyclesContext)
    return(
        <HistoryContainer>
            <h1>History</h1>
            <HistoryList>
                <table>
                    <thead>
                        <tr>
                            <th>Tasks</th>
                            <th>Duration</th>
                            <th>Start</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        { cycles && cycles.map(cycle => {
                            return (
                                /*
                                id: string,
                                    task: string,
                                    minutesAmount: number,
                                    startDate: Date,
                                    interruptedDate?: Date,
                                    finishedDate?: Date
                                */
                                <tr key={cycle.id}>
                                    <td>{cycle.task}</td>
                                    <td>{cycle.minutesAmount} minutes</td>
                                    <td>{cycle.startDate.toISOString()}</td>
                                    <td>
                                        { cycle.finishedDate && <Status statusColor="green">Done</Status> }
                                        { cycle.interruptedDate && <Status statusColor="red">Interrupted</Status> }
                                        { !cycle.finishedDate && !cycle.interruptedDate && <Status statusColor="yellow">in progress</Status> }
                                    </td>
                                </tr>
                            )

                        })}
                    </tbody>
                </table>
            </HistoryList>
        </HistoryContainer>
    )
}