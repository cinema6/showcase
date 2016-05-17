import createHashHistory from 'history/lib/createHashHistory';
import useRouterHistory from 'react-router/lib/useRouterHistory';

export default useRouterHistory(createHashHistory)({
    queryKey: false,
    basename: ''
});
