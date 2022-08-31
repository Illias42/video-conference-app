import { darken, whiten } from '@chakra-ui/theme-tools';

export const InputStyles = {
  baseStyle: {
    
  },
  sizes: {},
  variants: {
    outline: {
      field: {
        background: whiten('gray.800', 10),
        border: "1px solid",
        borderColor: "gray.800",
        color: 'gray.300',
        _hover: {
          borderColor: "primary",
        },
        _focus: {
          borderColor: "primary",
          boxShadow: "0 0 0 2px primary"
        }
      }
    }
  },
  defaultProps: {
    variant: null,
    focusBorderColor: 'primary'
  },
}