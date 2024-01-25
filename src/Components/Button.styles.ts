import styled from 'styled-components'

export type ButtonVariant = 'primary' | 'secondary';

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
    border-radius: 8px;

    background: ${props => props.theme['green-500']};
`;