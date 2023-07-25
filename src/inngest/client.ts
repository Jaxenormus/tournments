import { EventSchemas, Inngest } from "inngest";

type Events = {
  "tournament/date.set": {
    data: { id: string; isoDate:string };
  };
  "tournament/update": {
    data: { id: string };
  };
  "tournament/delete": {
    data: { id: string };
  };
};

export const inngest = new Inngest({
  name: "Tourney",
  schemas: new EventSchemas().fromRecord<Events>(),
});
