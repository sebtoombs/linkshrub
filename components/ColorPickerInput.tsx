import { forwardRef, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  Box,
} from "@chakra-ui/react";
import { ColorResult, SketchPicker } from "react-color";
import { WithRestProps } from "../types";

export type ColorPickerInputProps = {
  value: ColorPickerValue | undefined;
  onChange: (value: ColorPickerValue) => void;
};

export type ColorPickerValue = string;

function ColorPickerInput(props: ColorPickerInputProps, ref: any) {
  const { onChange, value } = props;

  const [selectedColor, setSelectedColor] = useState<string | undefined>(value);

  const handleChange = (color: ColorResult) => {
    const _value = color.hex;
    setSelectedColor(_value);
    if (typeof onChange === "function") {
      onChange.call(null, _value);
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button pl="0">
          <ColorSwatch
            color={selectedColor}
            mr="3"
            roundedTopLeft="md"
            roundedBottomLeft="md"
          />
          Pick color
        </Button>
      </PopoverTrigger>
      <PopoverContent width="220px" border="none">
        <SketchPicker
          color={selectedColor}
          onChangeComplete={handleChange}
          onChange={(color) => setSelectedColor(color.hex)}
        />
      </PopoverContent>
    </Popover>
  );
}
export default forwardRef<any, ColorPickerInputProps>(ColorPickerInput);

export type ColorSwatchProps = WithRestProps & {
  color?: ColorPickerValue;
};

function ColorSwatch({ color, ...props }: ColorSwatchProps) {
  return (
    <Box
      as="span"
      width="3rem"
      height="100%"
      bg={color as unknown as string}
      {...props}
    />
  );
}
