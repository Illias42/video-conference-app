import { darken, whiten } from '@chakra-ui/theme-tools';

export const TextareaStyles = {
  baseStyle: {
    
  },
  sizes: {},
  variants: {
    outline: {
      field: {
        border: "1px solid",
        borderColor: "gray.900",
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