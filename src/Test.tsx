interface TestComponent {
  (): JSX.Element;
  prop1: string;
}

function createTestComponent(): TestComponent {
  const Temp = () => {
    return <div>Hello, world!</div>;
  };
  Temp.prop1 = "hoge";

  return Temp;
}
