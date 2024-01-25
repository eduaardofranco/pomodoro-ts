import { ThemeProvider } from 'styled-components'
import { ButtonContainer } from "./Components/Button.styles";
import { defaultTheme } from './styles/themes/default';
import { GlobalStyle } from './styles/global';

export function App() {

  return (
    <ThemeProvider theme={defaultTheme}>
        <ButtonContainer variant="purple" />
        <ButtonContainer variant="primary" />

      <GlobalStyle />
    </ThemeProvider>
  )
}
