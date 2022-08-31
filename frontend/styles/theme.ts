import { extendTheme } from "@chakra-ui/react";
import { ButtonStyles as Button } from "./components/Button";
import { InputStyles as Input } from "./components/Input";
// import { TextareaStyles as Textarea } from "./components/Textarea"

export const Theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.700',
        color: 'gray.300'
      }
    }
  },
  colors: {
    'primary': '#6A2176',
    'gray': {
      700: '#1B1E24',
      800: '#282A30'
    }
  },
  components: {
    Button,
    Input,
    // Textarea
  }
})