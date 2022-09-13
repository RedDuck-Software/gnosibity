import React, { FC, PropsWithChildren } from 'react';

interface RenderIfProps extends PropsWithChildren {
  condition: boolean;
}

export const RenderIf: FC<RenderIfProps> = React.memo(
  ({ condition, children }) => (condition ? <>{children}</> : null),
);
