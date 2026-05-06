import styled from "@emotion/styled";

type Props = {
  size?: number | string;
};

export const IconFallback = ({ size = 24 }: Props) => {
  return <StyledFallback $size={size} />;
};

const StyledFallback = styled.div<{ $size: number | string }>(
  ({ $size }) => ({
    width: $size,
    height: $size,
    background: "#E9ECEF",
    borderRadius: 12,
  }),
);
