@foreach(\CheckoutEngine::flash()->get( 'errors' ) as $error)
	<div class="notice notice-error is-dismissible"><p>{{$error}}</p></div>
@endforeach

@foreach(\CheckoutEngine::flash()->get( 'success' ) as $success)
	<div class="notice notice-success is-dismissible"><p>{{$success}}</p></div>
@endforeach

@foreach(\CheckoutEngine::flash()->get( 'info' ) as $info)
	<div class="notice notice-info is-dismissible"><p>{{$info}}</p></div>
@endforeach
