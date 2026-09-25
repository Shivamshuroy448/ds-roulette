# State Management Architecture

State hierarchy:
* `AuthContext`: Tracks user session, guest state, and profile metadata.
* `MasteryDashboard`: Aggregates category completion metrics and streak counters.
* Local component state for wheel rotational velocity and drill answer tracking.
