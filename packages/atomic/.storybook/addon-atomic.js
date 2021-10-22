import React from 'react';
import {addons, types} from '@storybook/addons';
import {useStorybookState, useStorybookApi} from '@storybook/api';
import {TabButton, Code} from '@storybook/components';
import {} from '@storybook/addon-docs';

import {AddonPanel} from '@storybook/components';

const ADDON_ID = 'myaddon';
const PANEL_ID = `${ADDON_ID}/panel`;

// give a unique name for the panel
const MyPanel = () => {
  const api = useStorybookApi();
  const state = useStorybookState();
  console.log(api);
  console.log(state);
  return (
    <div>
      <Code>hello?</Code>
    </div>
  );
};

addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    type: types.TAB,
    route: ({storyId, refId}) =>
      refId ? `/mytab/${refId}_${storyId}` : `/mytab/${storyId}`,
    match: ({viewMode}) => viewMode === 'mytab',
    title: 'My Addon',
    render: ({active, key}) => (
      <div>
        <MyPanel></MyPanel>
      </div>
    ),
  });
});
