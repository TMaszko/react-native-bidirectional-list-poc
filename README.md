## Why did we create this example?

- we wanted to play around with the `react-native-bidirectional-infinite-scroll` package.
- we tried to test it against different scenarios like:
  pagination in both ways, scroll to particular element.
- we wanted to achieve smooth transition when data finally appears in the list once we have scrolled to the chosen item.

#### Here is the list what you can expect from this example:

- scrolling to the middle of the list once component has been mounted.
- Smooth transition _(**fade in** type of an animation)_ once list has scrolled to the chosen item
- both sides pagination with randomly generated data.

This example is heavily based on [this](https://github.com/GetStream/react-native-bidirectional-infinite-scroll) package.
