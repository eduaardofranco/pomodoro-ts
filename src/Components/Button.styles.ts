import styled from 'styled-components'

export type ButtonVariant = 'primary' | 'purple';

interface ButtonVariantProps {
    variant: ButtonVariant;
}

const buttonVariants = {
    primary: 'black',
    purple: 'purple'
}

export const ButtonContainer = styled.button<ButtonVariantProps>`
    width: 100px;
    height: 30px;

    ${props => {
        return `background-color: ${buttonVariants[props.variant]}`
    }}
`;