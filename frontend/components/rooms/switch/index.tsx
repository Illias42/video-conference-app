import SwitchSelector from "react-switch-selector";

const options = [
  {
      label: <span>Foo</span>,
      value: {
           foo: true
      },
      selectedBackgroundColor: "#0097e6",
  },
  {
      label: "Bar",
      value: "bar",
      selectedBackgroundColor: "#fbc531"
  }
];

const Switch = () => {
  const onChange = (newValue: any) => {
    console.log(newValue);
  };
  
  const initialSelectedIndex = options.findIndex(({value}) => value === "bar");
  
    return (
      <>
      <SwitchSelector
        onChange={onChange}
        options={options}
        initialSelectedIndex={initialSelectedIndex}
        backgroundColor={"#353b48"}
        fontColor={"#f5f6fa"}
      />
      </>
    )
}

export default Switch;