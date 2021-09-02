from functools import lru_cache
import logging
import datetime

from abc import abstractmethod

from RestrictedPython import (
    safe_builtins,
    utility_builtins,
    limited_builtins,
    compile_restricted
)
from RestrictedPython.Eval import default_guarded_getitem
from RestrictedPython.Guards import (
    full_write_guard,
    guarded_iter_unpack_sequence,
    guarded_unpack_sequence
)


extra_builtins = {
    'datetime': datetime,
    'sorted': sorted,
    'min': min,
    'max': max,
    'sum': sum,
    'any': any,
    'all': all,
}

builtins = safe_builtins.copy()
builtins.update(utility_builtins)
builtins.update(limited_builtins)
builtins.update(extra_builtins)


def safer_getattr(object, name, default=None, getattr=getattr):
    '''Getattr implementation which prevents using format on string objects.

    format() is considered harmful:
    http://lucumr.pocoo.org/2016/12/29/careful-with-str-format/

    '''
    if name == 'format' and isinstance(object, str):
        raise NotImplementedError(
            'Using format() on a %s is not safe.' % object.__class__.__name__)
    if name[0] == '_':
        raise AttributeError(
            '"{name}" is an invalid attribute name because it '
            'starts with "_"'.format(name=name)
        )
    val = getattr(object, name, default)
    return val


restricted_globals = {
    "__builtins__": builtins,
    "_getattr_": safer_getattr,
    "_write_": full_write_guard,
    "_getiter_": iter,
    "_getitem_": default_guarded_getitem,
    "_iter_unpack_sequence_": guarded_iter_unpack_sequence,
    "_unpack_sequence_": guarded_unpack_sequence
}

logger = logging.getLogger(__name__)


# CODE_FORMAT = """{expr})"""


class Query:
    def __init__(
        self,
        expr: str
    ):
        self.expr = expr

    @abstractmethod
    def match(
        self,
        run,
        metric=None
    ) -> bool:
        ...

    def __call__(
        self,
        run,
        metric=None
    ):
        return self.match(run=run,
                          metric=metric)


@lru_cache(maxsize=100)
def compile_checker(expr):
    source_code = expr
    byte_code = compile_restricted(source_code,
                                   filename='<inline code>',
                                   mode='eval')
    return byte_code


class RestrictedPythonQuery(Query):
    def __init__(
        self,
        query: str
    ):
        expr = self._strip_query(query=query)
        super().__init__(expr=expr)
        self._checker = compile_checker(expr)
        self.run_metadata_cache = None

    @staticmethod
    def _strip_query(query: str) -> str:
        import re
        default_expression = 'run.archived == False'
        stripped_query = query
        # cut the hardcoded part (SELECT something IF)
        if query.lower().startswith('select'):
            try:
                stripped_query = re.split('if',
                                          query,
                                          maxsplit=1,
                                          flags=re.IGNORECASE)[1]
            except IndexError:
                stripped_query = ''

        # add the default expression to the query if needed
        if stripped_query and 'run.archived' not in stripped_query:
            stripped_query += ' and ' + default_expression
        elif 'run.archived' not in stripped_query:
            stripped_query = default_expression

        return stripped_query

    def eval(
        self,
        run,
        metric
    ):
        namespace = dict(run=run, metric=metric, **restricted_globals)
        return eval(self._checker, restricted_globals, namespace)

    def __bool__(
        self
    ) -> bool:
        return bool(self.expr)

    def match(
        self,
        run,
        metric=None
    ) -> bool:

        # TODO enforce immutable
        try:
            return self.eval(run=run, metric=metric)
        except BaseException as e:
            logger.warning('query failed, %s', e)
            return False