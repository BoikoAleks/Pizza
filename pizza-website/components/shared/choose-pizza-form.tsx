import React from "react";

interface Props {
  imageUrl: string;
  name: string;
  className?: string;
  ingredients: IProduct["ingredients"];
  items?: IProduct["items"];
  onClickAdd?: VoidFunction;
}

export const ChoosePizzaForm: React.FC<Props> = ({ className }) => {};
