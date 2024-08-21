import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ToggleModeButton } from "../buttons/ToggleModeButton";

export default function PreferencesCard() {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-4">
          Motyw aplikacji
        </CardTitle>
        <CardDescription>
          Wybierz kolorystykę odpowiadającą Twoim preferencjom
        </CardDescription>
      </CardHeader>
      <CardContent className="!p-4">
        <ToggleModeButton />
      </CardContent>
    </Card>
  );
}
