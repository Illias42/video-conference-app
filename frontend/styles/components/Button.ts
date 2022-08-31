import { darken, whiten } from '@chakra-ui/theme-tools';

export const ButtonStyles = {
  variants: {
    primary: {
      bg: 'primary',
      color: 'gray.300',
    },
    ghost: {
      bg: 'transparent',
      color: 'gray.300',
      _hover: {
        bg: '#13131b'
      },
      _active: {
        bg: '#13131b'
      }
    },
    red: {
      bg: 'red.700',
      color: 'gray.300',
      _hover: {
        bg: whiten('red.700', 5)
      },
      _active: {
        bg: darken('red.700', 5)
      }
    }
  }
}