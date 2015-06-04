import javax.script.ScriptEngine;
import javax.script.ScriptException;
import javax.script.Bindings;
import javax.script.ScriptContext;
import javax.script.SimpleScriptContext;
import java.io.File;
import java.net.URL;
import jdk.nashorn.api.scripting.NashornScriptEngineFactory;
import jdk.nashorn.api.scripting.URLReader;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Callable;
import java.util.concurrent.Future;

public class ConcurrencyTest {

    public static String doRun(ScriptEngine engine, URL test) {
        final Bindings b = engine.createBindings();
        final ScriptContext context = new SimpleScriptContext();
        context.setBindings(b, ScriptContext.ENGINE_SCOPE);

        try {
            engine.eval(new URLReader(test), context);

        } catch (ScriptException e) {
            e.printStackTrace();
        }

        return "ok";
    }

    public static void main(String[] args) throws Exception {
        final URL test = new File("scripts/test.js").toURI().toURL();
        final ScriptEngine engine = new NashornScriptEngineFactory().getScriptEngine();

        ExecutorService pool = Executors.newFixedThreadPool(2);

        Future<String> res1 = pool.submit(() ->  {
            return doRun(engine, test);
        });

        Future<String> res2 = pool.submit(() -> {
            return doRun(engine, test);
        });

        res1.get();
        res2.get();

        pool.shutdown();
    }

}
