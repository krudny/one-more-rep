export type UseStepperParams = {
  value: number;
  min: number;
  decimals: number;
  step: number;
  onChange: (value: number) => void;
};

export type UseStepperResult = {
  text: string;
  handleFocus: () => void;
  handleBlur: () => void;
  handleChangeText: (inputText: string) => void;
  handleIncrement: () => void;
  handleDecrement: () => void;
};
