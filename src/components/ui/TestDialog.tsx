"use client";

interface Props {
  children: React.ReactNode;
}

const TestDialog = ({ children }: Props) => {
  return <>{children}</>;
};

TestDialog.Trigger = ({ children }: Props) => {
  return children;
};
TestDialog.Content = ({ children }: Props) => {
  return children;
};
TestDialog.Close = ({ children }: Props) => {
  return children;
};
export default TestDialog;

{
  /* <AnimatedModal>
    <AnimatedModal.Trigger>
        
    </AnimatedModal.Trigger>
    <AnimatedModal.Content>
        
    </AnimatedModal.Content>
    <AnimatedModal.Close>
        
    </AnimatedModal.Close>
</AnimatedModal> */
}
