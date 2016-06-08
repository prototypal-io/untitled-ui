export default function(/*options*/) {
  this.transition(
    this.fromRoute('panel.inbox'),
    this.toRoute('panel.index'),
    this.use('ios-left')
  );

  this.transition(
    this.fromRoute('panel.index'),
    this.toRoute('panel.inbox'),
    this.use('ios-right')
  );
}
