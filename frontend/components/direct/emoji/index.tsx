import Picker, { IEmojiPickerProps } from 'emoji-picker-react';
import { forwardRef } from '@chakra-ui/react';

export type EmojiPickerElement = HTMLDivElement;

const EmojiPicker = forwardRef<IEmojiPickerProps, any>(
  (props, ref) => {
    return (
      <div ref={ref}>
        <Picker {...props} />
      </div>
    );
  }
);

export default EmojiPicker;